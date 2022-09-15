import Head from "next/head";
import { memo, ReactNode } from "react";

import { Navbar } from "../navbar";
import { Sidebar } from "../sidebar";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const Page = memo<Props>(
  ({
    title,
    description = "Интернет, технологии, политика, мемы и многое другое.",
    children,
  }) => (
    <div className="flex-1 pt-14">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Клуб TeeJay" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:image" content="https://teejay.club/logo.jpg" />
        <meta
          property="og:image:secure_url"
          content="https://teejay.club/logo.jpg"
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="1080" />
      </Head>
      <Navbar />
      <main className="relative flex flex-row justify-center">
        <Sidebar />
        <div className="w-full py-4 flex flex-row items-start justify-center">
          {children}
        </div>
      </main>
    </div>
  )
);

Page.displayName = "Page";
