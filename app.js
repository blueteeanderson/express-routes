/** Demo app for routing. */
const express = require('express');
const ExpressError = require("./expressError")
const app = express();

app.use(express.json());

// mean route handler
app.get('/mean', function(req, res, next) {
    let { nums } = req.query;
    nums = createNumberArray(nums)
    try {
        const mean = nums.reduce((a,b) => a+b)/nums.length;
        if(!mean) throw new ExpressError('Invalid Numbers',400);
        return res.json(mean);
    } catch(e) {
        throw new ExpressError('Must include numbers',400);
    }
     
});

app.get('/median', function(req, res, next) {
    let { nums } = req.query;
    nums = createNumberArray(nums)
    try {
        const mid = Math.floor(nums.length / 2);
        //if even number in array
        let median;
        if (nums.length %2 ===0) 
            median = (nums[mid-1] + nums[mid])/2;
        else
            median = nums[mid];
        
         if(!median) throw new ExpressError('Invalid Numbers',400);
        return res.json(median);
    } catch(e) {
        throw new ExpressError('Must include numbers',400);
    }
     
});


app.get('/mode', function(req, res, next) {
    let { nums } = req.query;
    nums = createNumberArray(nums)
    try {
        let freqs = nums.reduce((acc, cur) => {
            if(isNaN(cur))
                throw new ExpressError('Invalid Numbers',400); 
            acc[cur] = (acc[cur] || 0) + 1;
             return acc;
            }, {});
  
        //create array for easy sort
        let freqAr = Object.entries(freqs);
        
        //sort values desc
        freqAr.sort((a, b) => b[1] - a[1]);
        return res.json(parseInt(freqAr[0]));
    } catch(e) {
        throw new ExpressError('Must include numbers',400);
    }
     
});




  

function createNumberArray(arr){
    if(arr) {
        return arr.split(",").map(Number).sort();
    } else {
        throw new ExpressError('Invalid Numbers',400);
    }
}

// 404 handler
app.use(function (req, res, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError)
});

// generic error handler
app.use(function(err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: {message, status}
  });
});
// end generic handler
app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});
// end app.listen
