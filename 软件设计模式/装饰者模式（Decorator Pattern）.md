装饰者模式（Decorator Pattern）是一种结构型设计模式，它允许用户通过将对象包装在装饰者类的对象中，来为原有对象动态地添加新的功能或职责，而不改变其结构。这种模式创建了一个装饰类，用来包装原有的类，并在保持原类方法签名完整性的前提下，提供了额外的功能。

### 动机

在软件开发中，我们经常需要给对象添加新的功能。最直接的方法是修改对象本身的代码，但这违反了开闭原则（对扩展开放，对修改关闭）。装饰者模式提供了一种灵活的解决方案，使得我们可以在不修改原有对象代码的情况下，通过创建一系列装饰者来给对象添加新的行为。

### 如何工作

- **组件接口（Component）**：定义一个对象接口，可以给这些对象动态地添加职责。
- **具体组件（ConcreteComponent）**：定义了一个对象，可以给这个对象添加一些额外的职责。
- **装饰者（Decorator）**：持有一个组件（Component）对象的引用，并定义一个与组件接口一致的接口。
- **具体装饰者（ConcreteDecorator）**：负责给组件添加新的职责。

### 示例

假设我们有一个简单的咖啡类，我们想要动态地给咖啡添加各种调料，如牛奶、糖等，而不改变咖啡类的代码。

**组件接口：**

```java
public interface Coffee {
    String getDescription();
    double cost();
}
```

**具体组件：**

```java
public class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "Simple Coffee";
    }

    @Override
    public double cost() {
        return 1.0;
    }
}
```

**装饰者抽象类：**

```java
public abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;

    // 构造函数
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }

    public String getDescription() {
        return decoratedCoffee.getDescription();
    }

    public double cost() {
        return decoratedCoffee.cost();
    }
}
```

**具体装饰者：**

```java
public class MilkDecorator extends CoffeeDecorator {

	// 构造函数
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Milk";
    }

    @Override
    public double cost() {
        return decoratedCoffee.cost() + 0.5;
    }
}

public class SugarDecorator extends CoffeeDecorator {

	//构造函数
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + ", Sugar";
    }

    @Override
    public double cost() {
        return decoratedCoffee.cost() + 0.2;
    }
}
```

**使用装饰者：**

```java
public class DecoratorDemo {
    public static void main(String[] args) {
        Coffee coffee = new SimpleCoffee();
        coffee = new MilkDecorator(coffee);
        coffee = new SugarDecorator(coffee);

        System.out.println(coffee.getDescription() + " Cost: $" + coffee.cost());
    }
}
```

在这个例子中，我们首先创建了一个简单的咖啡对象，然后通过添加不同的装饰者（例如牛奶和糖）来增加额外的功能。这样，我们就能在不修改原有咖啡类的情况下，动态地给咖啡对象添加新的行为。

### 优点

- 增加对象的职责时，装饰者模式提供了比继承更有弹性的替代方案。
- 可以用多个装饰者包装一个对象，以添加多重职责。
- 装饰者和被装饰的对象可以独立变化，遵循开闭原则。

### 缺点

- 使用装饰者模式会创建很多小对象，过多地使用会使系统变得复杂。
- 装饰链的设置比静态继承更为复杂。