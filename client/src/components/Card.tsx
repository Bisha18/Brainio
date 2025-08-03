import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";

export interface cardProps{
  title:string,
  link:string,
  type:"twitter" | "youtube";
}

export const Card = ({title,link,type}:cardProps) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <ShareIcon size="md" />
          {title}
        </div>
        <button className="hover:bg-gray-100 p-1.5 rounded transition">
          <a href={link} target="_blank">
           <PlusIcon size="md" />
          </a>
        </button>
      </div>

      {/* Content */}
      <div className="pt-2">
        {
          type==="youtube" &&
          <iframe
          className="w-full h-52 mt-4 rounded-md"
          src={link.replace("watch?v=", "embed/")}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        }
        {
          type==="twitter" &&
        <blockquote className="twitter-tweet w-full h-10 mt-4 rounded-md">
          <a href= {link}>
          </a>
        </blockquote>
        }

      </div>
    </div>
  );
};
