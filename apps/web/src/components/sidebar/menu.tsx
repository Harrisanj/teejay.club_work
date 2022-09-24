import {
  ClipboardDocumentIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import { classNames } from "../../utilities";
import { Link } from "../link";

export const Menu: FC = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-2">
      <Link href="/">
        <Item
          icon={
            <svg
              className={classNames("w-6 h-6 stroke-black", {
                "!stroke-amber-500":
                  router.pathname === "/" ||
                  router.pathname.startsWith("/top/"),
              })}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
              />
            </svg>
          }
        >
          Популярное
        </Item>
      </Link>
      <Link href="/new">
        <Item
          icon={
            <svg
              className={classNames("w-6 h-6 stroke-black", {
                "!stroke-amber-500": router.pathname === "/new",
              })}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        >
          Свежее
        </Item>
      </Link>
      <Link href="/subsites">
        <Item
          icon={
            <ListBulletIcon
              className={classNames("w-6 h-6 stroke-black", {
                "!stroke-amber-500": router.pathname === "/subsites",
              })}
              strokeWidth={1.5}
            />
          }
        >
          Подсайты
        </Item>
      </Link>
      <div className="mt-4"></div>
      <Link href="/rules">
        <Item
          className="bg-transparent text-black opacity-75 hover:opacity-100 hover:bg-gray-200 shadow-none hover:!shadow-none"
          icon={
            <div className="mt-0.5 flex items-end justify-center">
              <ClipboardDocumentIcon className="w-5 h-5" />
            </div>
          }
        >
          Правила
        </Item>
      </Link>
      <Link href="/donate">
        <Item
          className="bg-transparent text-black opacity-75 hover:opacity-100 hover:bg-gray-200 shadow-none hover:!shadow-none"
          icon={
            <div className="relative w-6 h-6">
              <svg
                className="w-full h-full fill-red-600 animate-heart"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
          }
        >
          Поддержать
        </Item>
      </Link>
      <div className="mt-4"></div>
      <Link href="https://github.com/teejayclub/teejay.club" target="_blank">
        <Item
          className="bg-transparent text-black opacity-75 hover:opacity-100 hover:bg-gray-200 shadow-none hover:!shadow-none"
          icon={
            <svg className="w-6 h-6" viewBox="0 0 16 16" version="1.1">
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
          }
        >
          GitHub
        </Item>
      </Link>
      <Link href="https://t.me/teejayclub" target="_blank">
        <Item
          className="bg-transparent text-black opacity-75 hover:opacity-100 hover:bg-gray-200 shadow-none hover:!shadow-none"
          icon={
            <svg
              className="w-6 h-6"
              viewBox="0 0 128 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64 0C47.03 0 30.74 6.747 18.75 18.745C6.75 30.743 0 47.033 0 64C0 80.967 6.75 97.257 18.75 109.255C30.74 121.253 47.03 128 64 128C80.97 128 97.26 121.253 109.25 109.255C121.25 97.257 128 80.967 128 64C128 47.033 121.25 30.743 109.25 18.745C97.26 6.747 80.97 0 64 0Z"
                // eslint-disable-next-line react/no-unknown-property
                fill="url(#linear_gradient)"
              />
              <path
                d="M28.7429 62.9685C47.2684 54.7841 59.6186 49.3879 65.7937 46.781C83.4456 39.3366 87.1089 38.0437 89.5015 38.0004C90.0277 37.9914 91.1991 38.1233 91.9636 38.7506C92.599 39.2792 92.7778 39.9942 92.8672 40.4956C92.9466 40.9971 93.0559 42.14 92.9666 43.0321C92.0135 53.2224 87.8735 77.9508 85.7688 89.3645C84.8852 94.194 83.1279 95.8132 81.4302 95.9713C77.737 96.3156 74.9372 93.4982 71.3632 91.1226C65.7738 87.404 62.6169 85.09 57.1863 81.462C50.9119 77.2691 54.9822 74.9642 58.5563 71.1983C59.4895 70.2125 75.7513 55.2141 76.0591 53.8537C76.0988 53.6835 76.1387 53.0492 75.7614 52.7149C75.3941 52.3796 74.8477 52.4943 74.4506 52.585C73.8847 52.7139 64.9595 58.7031 47.6452 70.5518C45.1136 72.318 42.8203 73.1789 40.7553 73.1336C38.4918 73.0843 34.1238 71.8326 30.8773 70.7633C26.9062 69.4512 23.739 68.7575 24.017 66.5291C24.156 65.3691 25.7348 64.1819 28.7429 62.9685Z"
                className="fill-white"
              />

              <defs>
                <linearGradient
                  id="linear_gradient"
                  x1="64"
                  y1="0"
                  x2="64"
                  y2="128"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2AABEE" />
                  <stop offset="1" stopColor="#229ED9" />
                </linearGradient>
              </defs>
            </svg>
          }
        >
          Telegram
        </Item>
      </Link>
      <Link href="https://discord.gg/qr2uyNh2fE" target="_blank">
        <Item
          className="bg-transparent text-black opacity-75 hover:opacity-100 hover:bg-gray-200 shadow-none hover:!shadow-none"
          icon={
            <svg
              className="w-6 h-6"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z"
                className="fill-[#404EED]"
              />
              <path
                d="M33.7379 15.68C31.9125 14.8933 29.974 14.32 27.9506 14C27.6958 14.4133 27.4128 14.9733 27.2147 15.4133C25.0626 15.12 22.9259 15.12 20.8034 15.4133C20.6053 14.9733 20.3081 14.4133 20.0676 14C18.03 14.32 16.0915 14.8933 14.2789 15.68C10.614 20.7733 9.62355 25.7466 10.1188 30.6533C12.5526 32.3199 14.9015 33.3333 17.2093 34C17.7753 33.28 18.2847 32.5066 18.7234 31.6933C17.8886 31.4 17.0962 31.0399 16.3321 30.6133C16.5302 30.48 16.7283 30.3333 16.9122 30.1867C21.5251 32.1733 26.5214 32.1733 31.0777 30.1867C31.2758 30.3333 31.4597 30.48 31.6578 30.6133C30.8937 31.0399 30.1014 31.4 29.2665 31.6933C29.7051 32.5066 30.2146 33.28 30.7805 34C33.087 33.3333 35.45 32.3199 37.8711 30.6533C38.4794 24.9733 36.9074 20.04 33.7379 15.68ZM19.3601 27.6266C17.9734 27.6266 16.8414 26.44 16.8414 24.9867C16.8414 23.5334 17.9451 22.3466 19.3601 22.3466C20.761 22.3466 21.9071 23.5334 21.8788 24.9867C21.8788 26.44 20.761 27.6266 19.3601 27.6266ZM28.6581 27.6266C27.2713 27.6266 26.1379 26.44 26.1379 24.9867C26.1379 23.5334 27.243 22.3466 28.6581 22.3466C30.0589 22.3466 31.205 23.5334 31.1767 24.9867C31.1767 26.44 30.0731 27.6266 28.6581 27.6266Z"
                className="fill-white"
              />
            </svg>
          }
        >
          Discord
        </Item>
      </Link>
    </div>
  );
};

type ItemProps = JSX.IntrinsicElements["div"] & {
  icon?: ReactNode;
};

const Item: FC<ItemProps> = ({
  icon = <></>,
  className,
  children,
  ...props
}) => (
  <div
    className={classNames(
      "flex flex-row items-center rounded bg-white px-2 py-2 shadow-sm hover:shadow-md active:shadow-sm cursor-pointer transition-all duration-300",
      className
    )}
    {...props}
  >
    <div className="w-6 h-6">{icon}</div>
    <div className="ml-2">{children}</div>
  </div>
);
