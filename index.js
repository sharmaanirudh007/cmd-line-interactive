const inquirer = require('inquirer');
const moment =   require('moment');
const queryEngine = require('./query');
const fetchPrices = require('./fetch');
require('dotenv').config()
function main(){
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'query_option',
            message: 'Query for portfolio value',
            choices: [
            '1. Return the latest portfolio value per token',
            '2. Return the latest portfolio value of a specific token',
            '3. Return the portfolio value per token for a specific date',
            '4. Return the portfolio value of a specific token for a specific date'
            ],    
        },
    ])
    .then((answers) => {
        // console.log(answers);
        // console.log(answers.query_option.substring(0,1));
        switch(answers.query_option.substring(0,1)){
            case '1':

                queryEngine.query({}).then((res)=>{
                   // console.log(res.rows);
                    let price;
                    res.rows.forEach(async (element) => {
                        price = await fetchPrices(element.token);
                        console.log("\n",element.token.trim(),"=>",price.USD*element.diff);
                    });
                    main();
                }).catch((err)=>{
                console.log(err)
                main();
                });                
                break;
            case '2':
                inquirer.prompt([
                    {
                        type:'list',
                        name:'tokenType',
                        message:'Select token',
                        choices:['BTC','ETH','XRP']
                    }
                ]).then((answer)=>{
                    queryEngine.query(answer).then((res)=>{
                        res.rows.forEach(async (element) => {
                            price = await fetchPrices(element.token);
                            console.log("\n",element.token.trim(),"=>",price.USD*element.diff);
                        });
                        main();
                    }
                ).catch((err)=>{
                    console.log(err)
                    main();
                });
                    
                })
                break;
            
            case '3':
                inquirer.prompt([
                    {
                        type:'input',
                        name:'date',
                        message:'Input date (YYYY-MM-DD)',
                        validate(value){
                            if(moment(value).isValid()===true){
                                console.log(moment(value).format("YYYY-MM-DD"))
                                return true;
                        }
                        return "Invalid date format"
                    }
                }
                ]).then((answer)=>{
                    queryEngine.query(answer).then((res)=>{
                        res.rows.forEach(async (element) => {
                            price = await fetchPrices(element.token);
                            console.log("\n",element.token.trim(),"=>",price.USD*element.diff);
                        });
                        main();
                    })
                }).catch(err=>{
                    console.log(err)
                    main();
                })
                break;
            
            case '4':
                inquirer.prompt([
                    {
                        type:'list',
                        name:'tokenType',
                        message:'Select token',
                        choices:[
                            'BTC','ETH','XRP'
                        ]
                    }
                ]).then((answer1)=>{
                    inquirer.prompt([
                        {
                            type:'input',
                            name:'date',
                            message:'Input date',
                        }
                    ]).then((answer2)=>{
                        queryEngine.query({...answer1, ...answer2}).then((res)=>{
                            res.rows.forEach(async (element) => {
                                price = await fetchPrices(element.token);
                                console.log("\n",element.token.trim(),"=>",price.USD*element.diff);
                            });
                            main();
                        })
                    }).catch(err=>{
                        console.log(err)
                        main();
                    })
                })
                break;
        }
       
    })
    .catch((error) => {
        if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        } else {
        // Something else went wrong
        }
    });
}
main();