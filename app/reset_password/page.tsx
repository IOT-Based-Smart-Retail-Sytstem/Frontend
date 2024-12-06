import ForgetPasswordLayout from "@/components/ForgetPasswordLayout";
import CreateNewPassword from "@/components/CreateNewPassword";

const page = () => {
    return (
        <div className="flex">
            <CreateNewPassword />
            <ForgetPasswordLayout />
        </div>
    );
};

export default page;
