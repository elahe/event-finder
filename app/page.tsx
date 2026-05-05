import Image from "next/image";
import ExploreBtn from "./components/ExploreBtn";

export default function Home() {
  return (
    < section>
      <h1 className="text-center"> The Hub for Every Dev <br/> Event You Can't Miss</h1>
      <p className="text-center mt-5">hachathon,meetup and confrances</p>
      <ExploreBtn/>
      <div className="mt-20 space-y-7">
        <h3>feature events</h3>
        <ul className="events"></ul>
        {[1,2,3,4,5].map((event)=>(
          <li key={event}>Event {event}</li>
        ))}

      </div>
    </section>
  );
}
