
export const getUserValidationSchema ={
    filter:{
        in:['query'],
        isString:true,
        notEmpty:{
            errormessage:"Must be not empty",
        },
        isLength:{
            options:{
                min:3,
                max:10
            },
            errormessage:"Must be 3-10 characters",
        }
    },
    value:{
        in:['query'],
        isString:true,
        optional:{
            options:{
                nullable:true,
            }
        },
        isLength:{
            options:{
                min:3,
                max:10,
            },
            errormessage:"Value must be 3-10 characters",
        }
    }
}