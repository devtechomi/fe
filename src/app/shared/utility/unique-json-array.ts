export class UniqueJsonArray<T> {
    private key!: string;
    private collection: any[] = [];

    constructor(key: string) {
        this.key = key;
    }

    add(item: any): boolean {
        if (!this.collection.some(element => element[this.key] == item[this.key])) {
            this.collection.push(item);
            return true;
        }

        return false;
    }
    
    addRange(items: any[]): void {
        items.forEach(item => this.add(item));
    }

    remove(item: any): boolean {
        const index = this.collection.findIndex(
            element => element[this.key] === item[this.key]
        );

        if (index != 1) {
            this.collection.splice(index, 1);
            return true;
        }

        return false;
    }

    removeRange(items: any[]): void {
        items.forEach(item => this.remove(item));
    }

    clear(): void {
        this.collection = [];
    }

    get(): any[] {
       return this.collection; 
    }

    contains(item: any): boolean {
        return this.collection.some(element => element[this.key] === item[this.key]);
    }

    count(): number {
        return this.collection.length;
    }
}