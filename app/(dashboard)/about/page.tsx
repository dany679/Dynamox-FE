import Footer from "@/components/footer";
import { Heading } from "@/components/Heading";
import { toolsObjects } from "@/utils/constants";
import ContentAbout from "./content-about";
const page = toolsObjects.about;
const AboutPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <>
      <div>
        <Heading.root>
          <Heading.icon Icon={page.icon} iconColor={page.color} bgColor={page.color} />
          <Heading.title title={page.label} description={page.subTitle} color={page.colorDark} />
        </Heading.root>
        <ContentAbout />
      </div>
      <div>
        <div className="border-solid border-1 border-gray-200 border-radius-full " />
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
