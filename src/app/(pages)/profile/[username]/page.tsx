const Profile = ({ params }: { params: { username: string } }) => {
  return <div>Profile of {params.username}</div>;
};
export default Profile;
