import Header from "./Header";

function Provider ({children}) {
    return(
        <div>
            <Header />
            <div className="mt-32">
           {children}

            </div>
        </div>
    )
}

export default Provider;