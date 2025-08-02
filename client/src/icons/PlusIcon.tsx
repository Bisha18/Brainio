export interface Props {
  size:"sm" | "md" | "lg"
}

const iconSize = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
}
export const PlusIcon = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className={iconSize[props.size]}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};
