
import { HeroParallax } from "./ui/aceternity/hero-parallax";
import { TimelineDemo } from "./ui/aceternity/timelinedemo";
import Footer from "./ui/footer";

export default async function Home() {

  

  return (
    <div>
     
      <HeroParallax products={products} />
      <TimelineDemo />
      <Footer />
    </div>
    
  )
}


const products = [
  {
    title: "Home Page",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-1.jpeg",
  },
  {
    title: "dictionary Page",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-2.jpeg",
  },
  {
    title: "Your Words",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-3.jpeg",
  },
  {
    title: "Quiz",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-4.jpeg",
  },
  {
    title: "Account",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-5.jpeg",
  },
  {
    title: "Snobbish meaning",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-5.jpeg",
  },
  {
    title: "Rapid Quiz",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-6.jpeg",
  },
  {
    title: "Damning Meaning",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-7.jpeg",
  },
  {
    title: "allusive meaning",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-8.jpeg",
  },
  {
    title: "allusive",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-9.jpeg",
  },
  {
    title: "accorded",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-10.jpeg",
  },
  {
    title: "meaning",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-11.jpeg",
  },
  {
    title: "mean",
    link: "https://www.vocabtrivia.com/",
    thumbnail:
      "/p-12.jpeg",
  },
]