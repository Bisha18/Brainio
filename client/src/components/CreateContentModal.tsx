import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";

export interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: Props) {
  return (
    <div>
      {open && (
        <div
          className="w-screen h-screen bg-gray-800 fixed top-0 left-0 opacity-90
      flex justify-center items-center"
        >
          <div className="flex flex-col justify-center">
            <span className="bg-white opacity-100 p-4 rounded">
              <div className="flex justify-end">
                <div className="cursor-pointer" onClick={onClose}>
                  <CrossIcon />
                </div>
              </div>
              <div>
                <Input placeholder="title" onChange={() => {}} />
                <Input placeholder="link" onChange={() => {}} />
              <div className="flex justify-center">
                <Button variant="primary" text="submit" size="lg" />
              </div>
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  onChange,
  placeholder,
}: {
  onChange: () => void;
  placeholder: string;
}) {
  return (
    <div>
      <input
        type={"text"}
        placeholder={placeholder}
        className="px-4 py-2 m-2"
        onChange={onChange}
      />
    </div>
  );
}
