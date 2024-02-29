import Image from "next/image";

const Loader = () => (
  <div className="h-full flex flex-col gap-4 items-center" data-test="loader-id">
    <div className="w-10 h-10 relative animate-spin">
      <Image src={"/logo.png"} alt="logo" width={30} height={30} />
    </div>
    <p className="text-sm text-muted-foreground">Dynamox esta carregando...</p>
  </div>
);

export default Loader;
