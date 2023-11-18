import { usePrivy } from "@privy-io/react-auth";

const Login = () => {
  const { login } = usePrivy();

  return (
    <div className="h-screen w-screen items-center justify-center">
      <div className="flex flex-col gap-12">
        {/* <div className="hidden sm:flex flex-col items-center justify-center bg-blue h-screen"> */}
        <div className="flex flex-col items-center justify-center bg-blue h-screen">
          <img src="/images/sheep.svg" alt="Sheep Icon" className="w-18 h-18" />
          <p className="p-2 font-bold text-4xl text-white">Sheep Up</p>
          <p className="p-2 font-bold text-md  text-white">An onchain Sheeping (Sheep * ship it) game</p>
          <div className="w-72 tracking-tight text-xs bg-stone-300 p-2 rounded-sm text-gray-200">
            This is beta software that is an interface to (open source, verified)
            smart contracts not known to have been audited. Use at your own risk.
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="h-12 select-none">
              <div
                className="bg-blue text-white border border-r-2 border-b-4 border-white font-bold tracking-tight p-2 text-xl rounded-sm w-72 text-center active:border"
                onClick={login}
              >
                <button>SIGN IN</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
