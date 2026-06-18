/* エンプティステート */

export const EmptyState = ({
  icon = "📄",
  title = "データがありません",
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-sub-bg rounded-2xl max-w-sm mx-auto my-8">
      <div className="flex items-center justify-center mb-2 text-3xl animate-[bounce_3s_infinite,pulse_2s_infinite]">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-main-dark">{title}</h3>
      {description && (
        <p className="text-xs text-muted mt-1 max-w-[200px]">{description}</p>
      )}
    </div>
  );
};
export default EmptyState;
