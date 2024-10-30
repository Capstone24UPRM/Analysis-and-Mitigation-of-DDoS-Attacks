import Setup from "@/components/Setup";
import LogsWindow from "@/components/LogsWindow";

export default function Simulation() {
  return (
    <div className="mt-[200px]">

        <div className="flex justify-end mb-2">
          <Setup />
        </div>

        <div>
          <LogsWindow />

          <a
            href="https://yourwebsite.com"
            target="_blank"
            rel="noopener noreferrer"
            className=" text-blue-500 hover:underline text-sm"
          > Visit Website
          </a>
        </div>
    </div>

  );
}
