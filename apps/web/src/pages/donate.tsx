import { HeartIcon } from "@heroicons/react/20/solid";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Fragment, memo, useState } from "react";

import { Card } from "../components/card";
import { NewComments } from "../components/comments";
import { Link } from "../components/link";
import { Page } from "../components/page";
import { withInitialData } from "../utilities";

const template = encodeURIComponent(`Добрый день!
                  
Я пожертвовал клубу некоторую сумму денег в валюте {BTC,LTC,ETH}.
Мой {логин,имя} на сайте: username.
Номер транзакции: f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16.`);

export const getServerSideProps = withInitialData(async () => {
  return { props: {} };
});

export default function Donate() {
  return (
    <Page title="Поддержать клуб TeeJay">
      <div className="md:max-w-2xl w-full md:mx-auto overflow-hidden">
        <Card className="flex flex-col gap-y-3 content">
          <h1 className="!text-2xl">Поддержать клуб TeeJay</h1>
          <div className="mt-2 flex flex-col gap-y-3 content">
            <p>
              Клуб TeeJay развивается только за счёт сообщества и вы тоже можете
              поучаствовать в его развитии.
            </p>
            <p>
              Самое главное на сайте — это контент. Поэтому, если вы напишите
              статью или комментарий, то вы уже сделаете вклад в развитие клуба.
            </p>
            <p>
              Найдя ошибку на сайте, вы можете напишите в подсайт{" "}
              <Link href="/subsites/bugs">Сломалось</Link>.
            </p>
            <p>
              Веб-разработчики, мобильные разработчики, тестировщики и дизайнеры
              могут присоединиться к разработке. Заходите в{" "}
              <a
                href="https://discord.gg/qr2uyNh2fE"
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </a>{" "}
              и{" "}
              <a
                href="https://github.com/teejayclub/teejay.club"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
              .
            </p>
            <p>
              Есть возможность помочь финансами? Вы можете сделать пожертвование
              в криптовалюте по реквизитам, которые указаны ниже.
            </p>
            <p>
              Все, кто сделает пожертвование, получат уникальный значок в виде
              сердца <HeartIcon className="inline w-5 h-5 fill-red-500" /> рядом
              с ником. Для этого напишите на почту{" "}
              <a
                href={`mailto:admin@teejay.club?subject=Пожертвование&body=${template}`}
                target="_blank"
                rel="noreferrer"
              >
                admin@teejay.club
              </a>{" "}
              номер транзакции и логин/имя в клубе.
            </p>
            <CryptoWallet
              name="BTC"
              address="bc1qpz5zan2re29jufv85l58ha2ucvkqxuuq7k7kla"
            />
            <CryptoWallet
              name="LTC"
              address="ltc1qvuxnvp7xl2jh67uk5lpe2250s5e747ls5v7u24"
            />
            <CryptoWallet
              name="ETH"
              address="0x750F7321a8278f3d2e9D1b6Fd0b38d1b597406dF"
            />
          </div>
        </Card>
      </div>
      <NewComments />
    </Page>
  );
}

type CryptoWalletProps = {
  name: string;
  address: string;
};

const CryptoWallet = memo<CryptoWalletProps>(({ name, address }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(address).then(() => setIsCopied(true));
  };
  return (
    <Fragment>
      <h2>{name}</h2>
      <code className="-mx-4 p-4 flex flex-row justify-between items-center overflow-auto">
        <span>{address}</span>
        {isCopied ? (
          <CheckIcon className="w-6 h-6  stroke-green-500" />
        ) : (
          <DocumentDuplicateIcon
            className="w-6 h-6 cursor-pointer"
            onClick={handleClick}
          />
        )}
      </code>
    </Fragment>
  );
});

CryptoWallet.displayName = "CryptoWallet";
