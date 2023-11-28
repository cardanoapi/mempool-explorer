class DependencyInjectionManager {
    private static instance: DependencyInjectionManager;
    private readonly dependencies: Map<string, any> = new Map();

    private constructor() {}

    public static getInstance(): DependencyInjectionManager {
        if (!DependencyInjectionManager.instance) {
            DependencyInjectionManager.instance =
                new DependencyInjectionManager();
        }
        return DependencyInjectionManager.instance;
    }

    public registerDependency(key: string, dependency: any): void {
        this.dependencies.set(key, dependency);
    }

    public getDependency<T>(key: string): T | undefined {
        return this.dependencies.get(key);
    }
}

export default DependencyInjectionManager;
