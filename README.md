## React-redux pattern project

## Table of Contents

- [Add a component](#add-a-component)

## Add a component

* `./src/components` Add `NetworkBoard.tsx` file.
* `./src/containers` Add `NetworkBoard.tsx` file.
* `./src/App.tsx` Add code:
```
<Route path="/board" component={NetworkBoard} />
```
* `./src/components/LeftMenu.tsx` add code:
```
<CMenuItem text="NETWORK MAP" icon={(<ShowChart />)} url="/board"/>
```

