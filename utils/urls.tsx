import { GetServerSideProps } from 'next';
export const IS_SERVER = typeof window === "undefined";
export function getProtocol() {
  const isProd = process.env.VERCEL_ENV === "production";
  if (isProd) return "https://";
  return "http://";
}
export function getAbsoluteUrl() {
  //get absolute url in client/browser
  if (!IS_SERVER) {
    return location.origin;
  }
  //get absolute url in server.
  const protocol = getProtocol();
  if (process.env.VERCEL_URL) {
    return `${protocol}${process.env.VERCEL_URL}`;
  }
}

// pages/my-page.tsx

type Props = {
  currentUrl: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  return {
    props: {
      currentUrl: context.req.url || '',
    },
  };
};

// Your layout component can then use `currentUrl` from props.
