import Link from "next/link";
import Swal from "sweetalert2";
import { CiLogout } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { MdGroups } from "react-icons/md";

const User = ({ user }) => {
  async function logout() {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status) {
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "http://localhost:3000/login";
        });
      } else {
        Swal.fire({
          title: "error",
          text: "Error al cerrar la sesión",
          icon: "error",
        });
      }
    } catch (err) {
      console.log(err);
      alert("Error in server");
    }
  }

  function showGroups() {
    document.getElementById("chat").classList.add("hidden");
    document.getElementById("groups").classList.remove("hidden");
    document.getElementById("new-group-item").classList.remove("hidden");
  }

  return (
    <section className="bg-[#171b23] flex flex-col text-white py-3">
      <article className="flex flex-col items-center justify-center mt-auto gap-5">
          <MdGroups size={25} className="cursor-pointer transition hover:opacity-50" onClick={showGroups}/>
          <CiLogout size={25} className="cursor-pointer transition hover:opacity-50" onClick={logout}/>
        <Link href={"/settings"} className="border-t pt-4 w-14">
          <CiSettings size={25} className="mx-auto transition hover:opacity-50" />
        </Link>
        {user?.thumbnail ? (
          <img
            src={user.thumbnail}
            alt="user-image-profile"
            className="w-[30px] h-[30px] align-middle rounded-full object-cover"
          />
        ) : (
          <div className="loader"></div>
        )}
      </article>
    </section>
  );
};

export default User;
