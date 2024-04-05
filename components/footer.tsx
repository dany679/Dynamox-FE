import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="w-full mx-auto sm:px-20 px-4 shadow border-t py-3 border-1 border-top-stone-900 ">
      <div className="flex  flex-col md:flex-row md:justify-between text-center ">
        <div className="flex flex-row items-center justify-center space-x-1 ">
          © 2024 Danie Rosa<a href="/" className="hover:underline"></a>
        </div>

        <div className="flex flex-row items-center justify-center space-x-1 text-neutral-800 dark:text-neutral-100">
          <Link href="https://github.com/dany679" rel="noreferrer" target="_blank">
            <GitHubIcon className="button_icons mx-2 text-gray-800 hover:text-gray-500" />
          </Link>
          <Link href="https://www.linkedin.com/in/danie-dev/" rel="noreferrer" target="_blank">
            <LinkedInIcon className="button_icons mx-2 text-[30px] text-sky-800 hover:text-sky-500" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
