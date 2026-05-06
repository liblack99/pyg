import {DocumentStoragePort} from "@/app/core/projects/documents/port/document-storage.port";
import {logger} from "@/app/lib/logger";
import {ZohoOAuthService} from "./zoho-oauth.service";

type ZohoFileItem = {
  id: string;
  attributes?: {
    name?: string;
    is_folder?: boolean;
    permalink?: string | null;
  };
};

export const zohoWorkDriveService: DocumentStoragePort = {
  async uploadFile({
    projectCode,
    documentType,
    documentFolderId,
    fileBuffer,
    fileName,
    mimeType,
  }) {
    const accessToken = await ZohoOAuthService.refreshAccessToken();
    const bytes = new Uint8Array(fileBuffer);

    const formData = new FormData();
    formData.append(
      "content",
      new Blob([bytes], {type: mimeType || "application/octet-stream"}),
      fileName,
    );

    const uploadUrl = `https://workdrive.zoho.com/api/v1/upload?parent_id=${encodeURIComponent(
      documentFolderId,
    )}`;

    logger.info("zoho.upload", "Starting file upload", {
      documentFolderId,
      projectCode,
      documentType,
      fileName,
      uploadUrl,
    });

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      body: formData,
    });

    const raw = await res.text();

    logger.info("zoho.upload", "Upload response received", {
      status: res.status,
      body: raw,
    });

    if (!res.ok) {
      throw new Error(
        `Zoho upload failed | status=${res.status} | body=${raw}`,
      );
    }

    const data = raw ? JSON.parse(raw) : null;

    return {
      fileId: data?.data?.[0]?.attributes?.resource_id ?? null,
      url: data?.data?.[0]?.attributes?.Permalink ?? null,
      projectFolderId: "",
      documentFolderId,
    };
  },

  async createFolder({
    parentFolderId,
    name,
  }: {
    parentFolderId: string;
    name: string;
  }) {
    const accessToken = await ZohoOAuthService.refreshAccessToken();

    const searchRes = await fetch(
      `https://workdrive.zoho.com/api/v1/files/${parentFolderId}/files`,
      {
        method: "GET",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          Accept: "application/vnd.api+json",
        },
      },
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();

      const existingFolder = searchData?.data?.find(
        (item: ZohoFileItem) =>
          item?.attributes?.name === name &&
          item?.attributes?.is_folder === true,
      );

      if (existingFolder?.id) {
        logger.info("zoho.folder", "Reused existing folder", {
          parentFolderId,
          folderName: name,
          folderId: existingFolder.id,
        });

        return {
          folderId: existingFolder.id,
        };
      }
    }

    const res = await fetch(`https://workdrive.zoho.com/api/v1/files`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "files",
          attributes: {
            name,
            parent_id: parentFolderId,
          },
        },
      }),
    });

    const raw = await res.text();

    logger.info("zoho.folder", "Create folder response received", {
      parentFolderId,
      folderName: name,
      status: res.status,
      body: raw,
    });

    if (!res.ok) {
      throw new Error(
        `Zoho create folder failed | status=${res.status} | body=${raw}`,
      );
    }

    const data = JSON.parse(raw);

    logger.info("zoho.folder", "Created new folder", {
      parentFolderId,
      folderName: name,
      folderId: data.data.id,
    });

    return {
      folderId: data.data.id,
    };
  },
};
