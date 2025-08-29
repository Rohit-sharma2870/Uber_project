import React from "react";
import { Link } from "react-router-dom";
function Index() {
  return (
    <div className="bg-cover bg-bottom bg-[url(https://images.unsplash.com/photo-1527603815363-e79385e0747e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRyYWZmaWMlMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D)] h-screen w-full flex flex-col justify-between">
      {" "}
      <div className="font-medium text-4xl p-8"> uber </div>{" "}
      <div className="bg-white flex flex-col justify-center items-center px-5 py-5 space-y-3 pb-10">
        {" "}
        <div className="text-3xl font-bold">Get started with Uber</div>{" "}
        <Link
          to="/userlogin"
          className=" flex items-center justify-center text-xl bg-black w-full py-4 rounded text-white mt-4"
        >
          continue
        </Link>{" "}
      </div>
    </div>
  );
}
export default Index;
