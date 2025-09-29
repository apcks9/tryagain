const CardComponent = ({ title, description }) => {
    return (
        <div className="w-[100px] h-[80px] bg-red-500 rounded-lg p-2 m-4 justify-center items-center flex flex-col ">
            
            <h2>{title}</h2>
            <p>{description}</p>    

        </div>
    )
}

export default CardComponent;



