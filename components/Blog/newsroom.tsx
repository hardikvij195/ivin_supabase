import BlogCard from "./blog-card";

  
  export default function Newsroom() {
    return (
      <div className="layout xl:px-20 px-8 xl:pt-16 pt-8 ">
        <div className="w-full flex flex-col justify-center items-center mb-10">
          <div className="mb-4 flex w-fit gap-[10px] px-4 py-2 text-primary border border-primary rounded-full ">
            <img src={"/home/feature.svg"}></img>
            <p>Article</p>
          </div>
  
          <p className="text-[30px] lg:text-[40px] font-fredoka font-semibold text-center">
            iVin Newsroom
          </p>
        </div>
  
        <div className="layout xl:px-20 grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <BlogCard/>
        <BlogCard/>
        <BlogCard/>
        <BlogCard/>
        <BlogCard/>
        <BlogCard/>
        <BlogCard/>
        <BlogCard/>
        
        </div>
      </div>
    );
  }
  