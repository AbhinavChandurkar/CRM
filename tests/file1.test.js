/**
 *  write any test 
 */

test('First test block', () => {
    console.log("hello world");
});


function add(a,b){
    return a+b;
}

test("testing the output of add",()=>{

    expect(add(3,4)).toBe(7);

});

test('testing two objects', () => {
    const obj = {
        name : "abhinav",
        age : 12 
    }

    expect(obj).toEqual({
            name : "abhinav",
            age : 12 
        }
    );

});


function fetchData(callback){
    setTimeout(()=>{
        callback("lololololololo")
    },2000);
};
test('testing callback function', () => {
    function callback(data){
        expect(data).toBe("lololololololo")
    }
    fetchData(callback);
});