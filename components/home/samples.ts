/// Code samples for the home page. Each one was compiled and run with vex, and [output] is what it printed.
export const samples = [
  {
    "id": "structs",
    "label": "Structs",
    "code": "struct User {\n    name: string\n    age: int = 18\n\n    fn greet() => println(\"Hi, I'm {name}\")\n\n    fn isAdult() -> bool => age >= 18\n}\n\nfn main() {\n    let users = [\n        User(name: \"Ann\", age: 30),\n        User(name: \"Sam\", age: 12),\n    ]\n    for user in users {\n        user.greet()\n        println(\"adult: {user.isAdult()}\")\n    }\n}",
    "output": "Hi, I'm Ann\nadult: true\nHi, I'm Sam\nadult: false"
  },
  {
    "id": "enums",
    "label": "Enums",
    "code": "enum Shape {\n    circle(radius: float)\n    rect(width: float, height: float)\n\n    fn area() -> float => match self {\n        circle(r) => 3.14 * r * r\n        rect(w, h) => w * h\n    }\n}\n\nfn main() {\n    let shapes = [Shape.circle(radius: 1), .rect(width: 2, height: 3)]\n    for s in shapes {\n        println(\"{s}: {s.area()}\")\n    }\n}",
    "output": "Shape.circle(radius: 1.0): 3.14\nShape.rect(width: 2.0, height: 3.0): 6.0"
  },
  {
    "id": "errors",
    "label": "Errors",
    "code": "fn parsePort(s: string) throws -> int {\n    if s == \"\" {\n        throw Error(\"empty port\")\n    }\n    return int(s)\n}\n\nfn main() {\n    let port = try parsePort(\"\") catch e {\n        println(\"bad port: {e.message}\")\n        8080\n    }\n    println(\"listening on {port}\")\n}",
    "output": "bad port: empty port\nlistening on 8080"
  },
  {
    "id": "async",
    "label": "Async",
    "code": "import \"vex:time\"\n\nasync fn fetch(url: string) -> string {\n    await time.sleep(100)\n    return \"page of {url}\"\n}\n\nasync fn main() {\n    let a = fetch(\"a.com\")\n    let b = fetch(\"b.com\")\n    println(await a)\n    println(await b)\n}",
    "output": "page of a.com\npage of b.com"
  }
];
