const adminRoute = async (req, res, next)=>{
    try {

        const user = req.user;

        if(user.role != "admin"){
               console.warn(`🔴 [ACCESS_DENIED] only admin can operate this actions.`);
            return res.status(400).json({
                success: false,
                message: `access denied`
            });
        }

        next();
        
    } catch (error) {
          console.warn(`🔴 [ADMIN_ROUTE_MIDDLEWARE] something wrong.`);
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Ooops! Internal server error 🛜.`
        });
    }
}

export default adminRoute