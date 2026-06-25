import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useInquiry, InquiryHistoryItem } from "@/contexts/InquiryContext";
import { toast } from "sonner";
import { User, Package, Heart, MapPin, LogOut, Edit2, Save, X, MessageSquare, Clock, CheckCircle, XCircle, Phone as PhoneIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<InquiryHistoryItem["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  pending: { label: "Pending", variant: "secondary", icon: <Clock className="w-3 h-3" /> },
  contacted: { label: "Contacted", variant: "default", icon: <PhoneIcon className="w-3 h-3" /> },
  completed: { label: "Completed", variant: "outline", icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { wishlistItems, inquiryHistory, currency } = useInquiry();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Profile Header */}
            <div className="bg-card p-6 md:p-8 shadow-elegant mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="font-display text-xl md:text-2xl text-foreground">{user.name}</h1>
                  <p className="font-body text-sm md:text-base text-muted-foreground">{user.email}</p>
                  <p className="font-body text-xs md:text-sm text-muted-foreground">
                    Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { 
                      month: "long", 
                      year: "numeric" 
                    })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <Link to="/wishlist" className="bg-card p-4 md:p-6 shadow-elegant text-center hover:shadow-lg transition-shadow">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                <p className="font-display text-xl md:text-2xl text-foreground">{wishlistItems.length}</p>
                <p className="font-body text-xs md:text-sm text-muted-foreground">Wishlist</p>
              </Link>
              <div className="bg-card p-4 md:p-6 shadow-elegant text-center hover:shadow-lg transition-shadow cursor-pointer">
                <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                <p className="font-display text-xl md:text-2xl text-foreground">{inquiryHistory.length}</p>
                <p className="font-body text-xs md:text-sm text-muted-foreground">Inquiries</p>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="bg-card shadow-elegant">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 rounded-none border-b border-border">
                  <TabsTrigger value="profile" className="font-body text-xs md:text-sm py-3 md:py-4">
                    Profile Info
                  </TabsTrigger>
                  <TabsTrigger value="address" className="font-body text-xs md:text-sm py-3 md:py-4">
                    Address
                  </TabsTrigger>
                  <TabsTrigger value="inquiries" className="font-body text-xs md:text-sm py-3 md:py-4">
                    Inquiries
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="font-body text-xs md:text-sm py-3 md:py-4 hidden md:block">
                    Orders
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="p-4 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display text-lg md:text-xl text-foreground">Personal Information</h2>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span className="hidden sm:inline">Save</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="bg-transparent"
                        />
                      ) : (
                        <p className="font-body text-foreground py-2 border-b border-border">
                          {user.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="bg-transparent"
                        />
                      ) : (
                        <p className="font-body text-foreground py-2 border-b border-border">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="bg-transparent"
                        />
                      ) : (
                        <p className="font-body text-foreground py-2 border-b border-border">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="address" className="p-4 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display text-lg md:text-xl text-foreground">Delivery Address</h2>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span className="hidden sm:inline">Save</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="md:col-span-2">
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        Street Address
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.address}
                          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                          className="bg-transparent"
                          placeholder="Enter your street address"
                        />
                      ) : (
                        <p className="font-body text-foreground py-2 border-b border-border">
                          {user.address || "Not added yet"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.city}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          className="bg-transparent"
                          placeholder="Enter your city"
                        />
                      ) : (
                        <p className="font-body text-foreground py-2 border-b border-border">
                          {user.city || "Not added yet"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-body text-sm text-muted-foreground mb-2">
                        PIN Code
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.pincode}
                          onChange={(e) => setEditData({ ...editData, pincode: e.target.value })}
                          className="bg-transparent"
                          placeholder="Enter PIN code"
                        />
                      ) : (
                        <p className="font-body text-foreground py-2 border-b border-border">
                          {user.pincode || "Not added yet"}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Inquiries Tab */}
                <TabsContent value="inquiries" className="p-4 md:p-8">
                  <h2 className="font-display text-lg md:text-xl text-foreground mb-6">Inquiry History</h2>
                  
                  {inquiryHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="font-body text-muted-foreground mb-4">No inquiries yet</p>
                      <Link to="/shop">
                        <Button variant="luxury">Browse Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiryHistory.map((inquiry, index) => {
                        const status = statusConfig[inquiry.status];
                        const displayPrice = currency === "INR" ? inquiry.productPriceINR : inquiry.productPrice;
                        const currencySymbol = currency === "INR" ? "₹" : "$";
                        
                        return (
                          <motion.div
                            key={inquiry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col sm:flex-row gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors"
                          >
                            {/* Product Image */}
                            <Link to={`/product/${inquiry.productId}`} className="shrink-0">
                              <img
                                src={inquiry.productImage}
                                alt={inquiry.productName}
                                className="w-full sm:w-20 h-32 sm:h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                              />
                            </Link>
                            
                            {/* Inquiry Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                <div>
                                  <Link 
                                    to={`/product/${inquiry.productId}`}
                                    className="font-display text-sm md:text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                                  >
                                    {inquiry.productName}
                                  </Link>
                                  <p className="font-accent text-xs text-primary uppercase tracking-wider">
                                    {inquiry.productCategory}
                                  </p>
                                </div>
                                <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                                  {status.icon}
                                  {status.label}
                                </Badge>
                              </div>
                              
                              <p className="font-display text-sm text-primary mb-2">
                                {currencySymbol}{displayPrice.toLocaleString()}
                                {inquiry.size && inquiry.color && (
                                  <span className="text-muted-foreground font-body text-xs ml-2">
                                    Size: {inquiry.size} • Color: {inquiry.color}
                                  </span>
                                )}
                              </p>
                              
                              <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-2">
                                "{inquiry.message}"
                              </p>
                              
                              <p className="font-body text-xs text-muted-foreground">
                                Sent on {new Date(inquiry.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="orders" className="p-4 md:p-8">
                  <h2 className="font-display text-lg md:text-xl text-foreground mb-6">Order History</h2>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="font-body text-muted-foreground mb-4">No orders yet</p>
                    <Link to="/shop">
                      <Button variant="luxury">Start Shopping</Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
