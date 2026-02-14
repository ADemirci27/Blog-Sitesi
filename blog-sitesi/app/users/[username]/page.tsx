import { prisma } from "@/lib/prisma";
import UserProfileClient from "./UserProfileClient";

type Props = {
  params: {
    username: string;
  };
};

export default async function UserProfilePage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Böyle bir kullanıcı bulunamadı.
      </p>
    );
  }

  return <UserProfileClient user={user} />;
}
