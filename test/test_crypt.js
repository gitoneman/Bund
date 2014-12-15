function encrypt(s,pw)
{
    var a=0;
    var myString='';
    var textLen=s.length;
    var pwLen=pw.length;

    for (i=0;i<textLen;i++)
    {
        a=parseInt(s.charCodeAt(i));

        a=a^(pw.charCodeAt(i%pwLen));
        a=a+"";
        while (a.length<3)
            a='0'+a;

        myString+=a;
    }
    return myString;
}

function decrypt(s,pw){
    var myString='';
    var a=0;
    var pwLen=pw.length;
    var textLen=s.length;
    var i=0;
    var myHolder="";
    while(i<s.length-2)
    {
        myHolder=s.charAt(i)+s.charAt(i+1)+s.charAt(i+2);
        if (s.charAt(i)=='0') {
            myHolder=s.charAt(i+1)+s.charAt(i+2);
        }
        if ((s.charAt(i)=='0')&&(s.charAt(i+1)=='0')) {
            myHolder=s.charAt(i+2);
        }
        a=parseInt(myHolder);
        a=a^(pw.charCodeAt(i/3%pwLen));
        myString+=String.fromCharCode(a);
        i+=3;
    }//end of while i
    return myString;
}

console.log(encrypt("111222", "TheBund2014"));

console.log(decrypt("053010006115071093","TheBun"));

console.log(encrypt("testuser", "TheBund2014"));

console.log(decrypt("032011023041019012000","TheBund2014"));
