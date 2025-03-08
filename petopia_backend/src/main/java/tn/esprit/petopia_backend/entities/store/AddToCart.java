package tn.esprit.petopia_backend.entities.store;

public class AddToCart {
    private int id_user;
    private int idProduct;
    private int quantity;

    public AddToCart(int id_user, int idProduct, int quantity) {
        this.id_user = id_user;
        this.idProduct = idProduct;
        this.quantity = quantity;
    }

    public int getId_user() {
        return id_user;
    }

    public void setId_user(int id_user) {
        this.id_user = id_user;
    }

    public int getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(int idProduct) {
        this.idProduct = idProduct;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
