import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from 'lucide-react'

export default function RatingsAndReviews() {
  // This would typically come from an API call
  const reviews = [
    { id: 1, author: 'John D.', rating: 5, comment: 'Fantastic organization! The event was flawless.' },
    { id: 2, author: 'Sarah M.', rating: 4, comment: 'Great experience overall. Minor hiccup with scheduling but quickly resolved.' },
    { id: 3, author: 'Alex K.', rating: 5, comment: 'Exceeded expectations. Will definitely attend their events again!' },
  ]

  return (
    (<div>
      <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={review.author} />
                  <AvatarFallback>{review.author[0]}</AvatarFallback>
                </Avatar>
                <span>{review.author}</span>
                <div className="flex ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>)
  );
}

