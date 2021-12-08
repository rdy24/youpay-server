module.exports= {
    index: async(req, res)=> {
        try {
            res.render('admin/product/view_product')
        } catch (err) {
            console.log(err)
        }
    },
    viewCreate: async(req,res) => {
        try {
            res.render('admin/product/create')
        } catch (err) {
            console.log(err)
        }
    }
}