const validSources = [`http://localhost:${process.env.PORT || 3000}`];

const corsOptions = {
    origin: function(origin,callback){
        if(!origin || validSources.indexOf(origin)!==-1){ // When no origin (like in Postman) allow it
            callback(null,true);
        }
        else{
            callback(new Error('Not allowed by CORS'),false);
        }
    },
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','authorization'], // This will limit headers to only these two, by default it allows any requested headers
    credentials: true,
    optionsSuccessStatus: 200
};

export default corsOptions;