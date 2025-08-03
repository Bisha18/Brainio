import { useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { CreateContentModal } from "./components/CreateContentModal";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/ShareIcon";
import { Sidebar } from "./components/Sidebar";

function App() {
  const [modalOpen,setModalOpen] = useState(true);
  return (
    <div>
      <Sidebar/>

    <div className="min-h-screen p-4">
        <CreateContentModal open={modalOpen}  onClose={() => setModalOpen(false)}/>
      {/* Buttons at top-right */}
      <div className="flex justify-end gap-4 mb-6 absolute right-4 top-4 ">
        <Button
          startIcon={<PlusIcon size="md" />}
          variant="primary"
          text="share"
          size="lg"
          onclick={()=>setModalOpen(true)}
        />
        <Button
          startIcon={<ShareIcon size="md" />}
          variant="secondary"
          text="Add me"
          size="lg"
        />
      </div>

      {/* Cards */}
      <div className="flex gap-4 items-start flex-wrap">
        <Card
          title="song"
          link="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          type="youtube"
        />
        <Card
          title="tweet"
          link="https://twitter.com/narendramodi/status/1951660264945750318"
          type="twitter"
        />
      </div>
    </div>
    </div>
  );
}

export default App;
