import React from "react";

const Footer = () => {
  return (
    <div className="bg-darkBg text-white py-4 mt-10 lg:px-16 md:px-12 sm:px-8 px-4">
      <section className=" flex-col xs:flex-row flex justify-between   py-8 gap-y-10 xs:items-end">
        <section className=" max-w-[400px] w-1/2">
          <h2 className=" mb-2 font-bold text-2xl">Damilare</h2>
          <p>
            Damilare is the name of the author of the stories, he's a brilliant
            writer who enjoys writing.
          </p>
        </section>
        <section className=" text-left  xs:text-right">
          <h4 className=" underline mb-2">Useful links</h4>
          <div className=" mb-2">Contact Me</div>
          <div>My portfolio</div>
        </section>
      </section>
      <footer className=" text-center">
        Created for Damilare by Oluwaseyi
      </footer>
    </div>
  );
};

export default Footer;
