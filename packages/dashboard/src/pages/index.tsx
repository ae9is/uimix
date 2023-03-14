import { Icon } from "@iconify/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  return (
    <>
      <Head>
        <title>UIMix</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center h-screen">
        <div>
          <div className="mb-24">
            <h1 className="flex justify-center mb-6">
              <svg
                width="209"
                height="64"
                viewBox="0 0 209 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>UIMix</title>
                <path
                  d="M97.7614 14.0909H106.182V36.608C106.182 39.2102 105.563 41.4773 104.324 43.4091C103.085 45.3295 101.358 46.8182 99.142 47.875C96.9261 48.9205 94.3523 49.4432 91.4205 49.4432C88.4545 49.4432 85.8636 48.9205 83.6477 47.875C81.4318 46.8182 79.7102 45.3295 78.483 43.4091C77.2557 41.4773 76.642 39.2102 76.642 36.608V14.0909H85.0795V35.875C85.0795 37.0795 85.3409 38.1534 85.8636 39.0966C86.3977 40.0398 87.142 40.7784 88.0966 41.3125C89.0511 41.8466 90.1591 42.1136 91.4205 42.1136C92.6818 42.1136 93.7841 41.8466 94.7273 41.3125C95.6818 40.7784 96.4261 40.0398 96.9602 39.0966C97.4943 38.1534 97.7614 37.0795 97.7614 35.875V14.0909ZM119.908 14.0909V49H111.47V14.0909H119.908ZM125.205 14.0909H135.653L144.517 35.7045H144.926L153.79 14.0909H164.239V49H156.023V27.5568H155.733L147.347 48.7784H142.097L133.71 27.4375H133.42V49H125.205V14.0909ZM169.501 49V22.8182H177.837V49H169.501ZM173.678 19.767C172.507 19.767 171.501 19.3807 170.661 18.608C169.82 17.8239 169.399 16.8807 169.399 15.7784C169.399 14.6875 169.82 13.7557 170.661 12.983C171.501 12.1989 172.507 11.8068 173.678 11.8068C174.859 11.8068 175.865 12.1989 176.695 12.983C177.536 13.7557 177.956 14.6875 177.956 15.7784C177.956 16.8807 177.536 17.8239 176.695 18.608C175.865 19.3807 174.859 19.767 173.678 19.767ZM190.233 22.8182L194.545 31.4432L199.011 22.8182H207.415L200.102 35.9091L207.688 49H199.352L194.545 40.3068L189.858 49H181.403L189.006 35.9091L181.778 22.8182H190.233Z"
                  fill="black"
                />
                <rect
                  opacity="0.25"
                  x="9"
                  y="9"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
                <rect
                  opacity="0.25"
                  x="9"
                  y="26"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
                <rect
                  x="9"
                  y="43"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
                <rect
                  x="26"
                  y="9"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
                <rect
                  x="26"
                  y="26"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#FF1EC0"
                />
                <rect
                  x="26"
                  y="43"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
                <rect
                  opacity="0.25"
                  x="43"
                  y="9"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
                <rect
                  x="43"
                  y="26"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
                <rect
                  x="43"
                  y="43"
                  width="12"
                  height="12"
                  rx="4"
                  fill="#1E5DFF"
                />
              </svg>
            </h1>
            <p className="text-center text-gray-500 mb-2">🚧 Pre-alpha</p>
            <p className="text-red-500 text-sm text-center">
              Data may be lost at any time. Do not use for production!
            </p>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-medium mb-8 text-center text-gray-800">
              Sign In / Sign Up
            </h2>
            <div className="flex flex-col gap-4 items-center">
              <button
                className="border border-gray-200 px-3 py-1 rounded shadow-sm text-sm flex items-center gap-2"
                onClick={() => {
                  signIn("google", { callbackUrl: "/documents" });
                }}
              >
                <Icon icon="flat-color-icons:google" className="text-base" />
                Continue with Google
              </button>
              <button
                className="border border-gray-200 px-3 py-1 rounded shadow-sm text-sm flex items-center gap-2"
                onClick={() => {
                  signIn("github", { callbackUrl: "/documents" });
                }}
              >
                <Icon icon="mdi:github" className="text-base" />
                Continue with GitHub
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/documents",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
