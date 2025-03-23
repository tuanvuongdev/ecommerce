const app = require("./src/app");

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, "localhost", () => {
    console.log(`Server running on port ${PORT}`);
})

// process.on("SIGINT", () => {
//     server.close(() => {
//         console.log("Exit server Express");
//     })
//     //notify(pring...)
// })