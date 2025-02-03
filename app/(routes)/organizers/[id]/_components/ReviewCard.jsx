import { useState } from "react";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewCard() {
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [isHovering, setIsHovering] = useState(0);

  const handleStarClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setNewReview((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log("Submitted review:", newReview);
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Rate your experience";
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Share Your Experience
        </CardTitle>
        <CardDescription>
          Your feedback helps others make better decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="rating"
              className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Rating
            </Label>
            <div className="space-y-2">
              <div className="flex gap-1" onMouseLeave={() => setIsHovering(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-8 h-8 transition-all cursor-pointer",
                      star <= newReview.rating || star <= isHovering
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    )}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setIsHovering(star)}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {getRatingText(isHovering || newReview.rating)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="comment"
              className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Your Review
            </Label>
            <Textarea
              id="comment"
              placeholder="What did you like or dislike? What stood out to you?"
              className="min-h-[120px] resize-none"
              value={newReview.comment}
              onChange={handleCommentChange}
            />
            <p className="text-sm text-muted-foreground">
              Minimum 10 characters
            </p>
          </div>

          <Button
            type="submit"
            className=""
            disabled={newReview.rating === 0 || newReview.comment.length < 10}
          >
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
