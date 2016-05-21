package com.infiniteskills.program;

public class Pair<T,S>
{
    private T o1;
    private S o2;
    
    public Pair(T object1, S object2)
    {
        this.o1 = object1;
        this.o2 = object2;
    }
    
    public T getFirstObject()
    {
        return this.o1;
    }
    
    public S getSecondObject()
    {
        return this.o2;
    }
}

