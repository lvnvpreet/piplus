const index = () => {
    return null
}

export const getServerSideProps = async(context) => {
    
    return {
        redirect: {
            destination: '/cash',
            permanent: false,
        }
    }
}

export default index