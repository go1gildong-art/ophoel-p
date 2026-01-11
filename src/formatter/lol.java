public class X {
    private int x;

    public int getX() {
        return this.x;
    }

    public int getRoundedX() {
        return Math.round(x);
    }

    public int getClampedX(int min, int max) {
        return Math.min(max, Math.max(min, this.x));
    }

    public void setX(int amount) {
        this.x = amount;
    }

    public void addToX(int amount) {
        this.x += amount;
    }

    public void subtractToX(int amount) {
        this.x -= amount;
    }

    public void multiplyToX(int amount) {
        this.x *= amount;
    }

    public void divideToX(int amount) {
        this.x /= amount;
    }

    public void remainderToX(int amount) {
        this.x %= amount;
    }

    public boolean isX(int amount) {
        return this.x == amount;
    }

    public boolean isNotX(int amount) {
        return this.x != amount;
    }
}