interface CardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  isPositive?: boolean; // Cambiamos subtextColor por este booleano
  action?: () => void;
  hasPermission?: boolean;
}

export default function CardDashboard({
  title,
  value,
  subtext,
  icon,
  isPositive = true,
}: CardProps) {
  const subtextColor = isPositive ? "text-emerald-500" : "text-red-500";

  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start transition-all hover:shadow-md">
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-tight">
          {title}
        </p>
        <h3 className="text-3xl font-bold mt-1 text-slate-800">{value}</h3>
        <p className={`text-xs mt-2 font-semibold ${subtextColor}`}>
          {subtext}
        </p>
      </div>
      <div className="bg-blue-50 p-3 rounded-full text-blue-500">{icon}</div>
    </div>
  );
}
