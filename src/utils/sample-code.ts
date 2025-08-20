export type Language = "javascript" | "css" | "html"
export type CodeAction = "beautify" | "minify"

export const sampleCode: Record<Language, string> = {
  javascript: `function calculateSum(a,b){if(a&&b){return a+b;}return 0;}const numbers=[1,2,3,4,5];const result=numbers.reduce((sum,num)=>sum+num,0);console.log('Sum:',result);class Calculator{constructor(initial=0){this.value=initial;}add(x){this.value+=x;return this;}multiply(x){this.value*=x;return this;}getResult(){return this.value;}}const calc=new Calculator(10).add(5).multiply(2);`,
  css: `.container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background-color:#f5f5f5;}.button{padding:12px 24px;border:none;border-radius:6px;background-color:#007bff;color:white;cursor:pointer;transition:background-color 0.3s ease;}`,
  html: `<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Sample HTML</title><link rel="stylesheet" href="styles.css"></head><body><header><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul></nav></header><main><section id="home"><h1>Welcome</h1><p>This is a sample HTML document with various elements.</p><div class="container"><button class="btn primary">Click me</button><button class="btn secondary">Learn more</button></div></section></main><footer><p>&copy; 2024 Sample Site</p></footer></body></html>`,
}
