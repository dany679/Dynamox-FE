import { cn } from "@/lib/utils";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import Link from "next/link";
import { project } from "./const";
export default function ContentAbout() {
  return (
    <article className="mx-6 mt-8  ">
      <div className="flex flex-col justify-center items-center gap-x-0">
        <h3 className="text-center pl-2">Um pouco mais sobre o site</h3>
        <div className="flex flex-row sm:items-center ">
          <TipsAndUpdatesIcon className="mt-6 md:mt-0" />
          <p className="pl-2">
            (O publico) Um trabalhador autonomo que conserta aparelhos pode catalogar os seus serviços no site
          </p>
        </div>
        <p className="text-center pl-2">Em caso de duvida clique na tecnologia abaixo ou no endereço github</p>
        <div className="flex flex-col items-center ">
          {project.map((type, index) => {
            const name = type.name;
            const stack = type.stack;
            const bg = type.hoverBg;
            const subtitle = type.subtitle || "";
            const linkGit = subtitle ? "https://github.com/dany679/" + subtitle : null;
            return (
              <div key={index} className="flex flex-col">
                <h4 className={cn("pr-2 capitalize text-center")}>{name}</h4>
                {linkGit && (
                  <Link href={linkGit} className="no-underline" rel="noreferrer" target="_blank">
                    {<p className="text-center">{subtitle}</p>}
                  </Link>
                )}
                <div className="flex flex-wrap flex-row justify-center ">
                  {stack.map((item, idx) => {
                    return (
                      <Link href={item.url} key={idx} className="no-underline" rel="noreferrer" target="_blank">
                        <p className={cn("pill capitalize", `cursor-pointer ${bg} hover:text-white`)}>{item.name}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
