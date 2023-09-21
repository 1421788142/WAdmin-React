import LoginForm from "./loginForm"

const loginRight = () => {
    return (
        <div className="w-[100%] xl:w-[50%] h-[100%] px-2 flex items-center justify-center">
            <div className="w-[100%] sm:w-[60%] xl:w-[65%] overflow-hidden mx-auto shadow-2xl bg-white dark:bg-[#141414] rounded-2xl p-[2.5vw]">
                <LoginForm />
            </div>
        </div>
    )
}

export default loginRight

