import Avatar from "@/public/icons/avatar.svg";
import {
  useGetUsersQuery,
  useRemoveUserMutation,
} from "@/store/features/api/subApi/userApi";
import { timeAgo } from "@/utils/formatting";
import Image from "next/image";
import Button from "../atoms/common/Button";

export function UserList() {
  const startTime = Date.now();
  const duration = Date.now() - startTime;

  const { data: users } = useGetUsersQuery();
  const [removeUser, { isLoading: isRemoving }] = useRemoveUserMutation();

  if (!users) return null;

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Users</h2>
          <p className="text-sm text-gray-500">
            Fetched {users.length} users in {duration}ms
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-900/5">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <Image
                src={user.picture || Avatar}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full ring-1 ring-gray-900/5"
              />
              <div className="space-y-1">
                <p className="font-medium leading-none">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{timeAgo(user.createdAt)}</p>
            <Button
              variant="warning"
              disabled={isRemoving}
              loading={isRemoving}
              onClick={() => {
                removeUser({ userId: user.id }).unwrap();
              }}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
