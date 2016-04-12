# Steel-Commander
> 
###Attention
>Currently, it is not recommanded using the GUI mode,cause there are some bug of nodejs.

###Instal
Install globally with `npm install -g steel-commander`.

###Commander Support

* 1 steel install
* 2 steel update
* 4 steel init
* 5 steel server
* 6 steel build

###steel install

install the steel dependencies.
If `package.json` file exists, this command will add steel dependencies to the file.
```javasctipt
steel install -t <type>
```

###steel update
Update global CLI module

###steel init
* `-t <type>`  template type  
* `-f` overwrittern existed files

Output the project template to project folder
```javasctipt
steel init -t t4
steel init -f
steel init -ft t5
```
###steel server
* `--pm2` (--pm2 for Linux only).
* `--dist`

```javasctipt
steel server --dist
steel server --pm2
```
   
###steel build

